'use server';

import { PropertyFormSchema, PropertyInput } from '@/lib/validations/property';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Helper to verify caller authentication and profile role
 */
async function verifyStaffSession() {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false as const, user: null, role: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active) {
    return { authorized: false as const, user, role: null };
  }

  return { authorized: true as const, user, role: profile.role || 'agent' };
}

/**
 * 1. Create a new property listing
 */
export async function createProperty(input: PropertyInput) {
  const session = await verifyStaffSession();
  if (!session.authorized || !session.user) {
    return { success: false, message: 'Unauthorized: Please log in as staff to create listings.' };
  }

  const validation = PropertyFormSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed. Please verify the property specifications.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const data = validation.data;
  const supabase = createClient();

  // Enforce agent attribution guard
  let assignedAgentId = data.agent_id;
  if (session.role === 'agent') {
    assignedAgentId = session.user.id;
  }

  // Generate unique collision-resistant slug
  const cleanTitle = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const slug = `${cleanTitle}-${data.reference_code.toLowerCase()}`;

  const { data: created, error: insertError } = await supabase
    .from('properties')
    .insert({
      reference_code: data.reference_code,
      title: data.title,
      slug,
      description: data.description || null,
      purpose: data.purpose,
      category: data.category,
      publication_status: data.publication_status,
      availability_status: data.availability_status,
      plot_file_status: data.plot_file_status,
      is_price_on_call: data.is_price_on_call,
      price_pkr: data.is_price_on_call ? null : data.price_pkr,
      area_value: data.area_value,
      area_unit: data.area_unit,
      marla_sqft_standard: data.marla_sqft_standard,
      city: data.city,
      area_location: data.area_location,
      sector_block: data.sector_block || null,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      features: data.features,
      images: data.images,
      featured_image: data.featured_image || (data.images.length > 0 ? data.images[0] : null),
      agent_id: assignedAgentId,
      created_by: session.user.id,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Create Property Error:', insertError);
    return {
      success: false,
      message: insertError.message || 'Failed to create property listing in database.',
    };
  }

  revalidatePath('/properties');
  revalidatePath('/admin');
  revalidatePath('/admin/properties');

  return { success: true, message: 'Property listing created successfully.', property: created };
}

/**
 * 2. Update an existing property listing
 */
export async function updateProperty(propertyId: string, input: PropertyInput) {
  const session = await verifyStaffSession();
  if (!session.authorized || !session.user) {
    return { success: false, message: 'Unauthorized: Please log in as staff to edit listings.' };
  }

  const validation = PropertyFormSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed. Please verify the property specifications.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const data = validation.data;
  const supabase = createClient();

  // If role is agent, verify the listing was created by them or assigned to them
  if (session.role === 'agent') {
    const { data: existing } = await supabase
      .from('properties')
      .select('created_by, agent_id')
      .eq('id', propertyId)
      .single();

    if (existing && existing.created_by !== session.user.id && existing.agent_id !== session.user.id) {
      return { success: false, message: 'Forbidden: Agents can only modify their own listings.' };
    }
  }

  // Update slug to reflect current title & reference
  const cleanTitle = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const slug = `${cleanTitle}-${data.reference_code.toLowerCase()}`;

  const { data: updated, error: updateError } = await supabase
    .from('properties')
    .update({
      reference_code: data.reference_code,
      title: data.title,
      slug,
      description: data.description || null,
      purpose: data.purpose,
      category: data.category,
      publication_status: data.publication_status,
      availability_status: data.availability_status,
      plot_file_status: data.plot_file_status,
      is_price_on_call: data.is_price_on_call,
      price_pkr: data.is_price_on_call ? null : data.price_pkr,
      area_value: data.area_value,
      area_unit: data.area_unit,
      marla_sqft_standard: data.marla_sqft_standard,
      city: data.city,
      area_location: data.area_location,
      sector_block: data.sector_block || null,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      features: data.features,
      images: data.images,
      featured_image: data.featured_image || (data.images.length > 0 ? data.images[0] : null),
      agent_id: session.role === 'admin' ? data.agent_id : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId)
    .select()
    .single();

  if (updateError) {
    console.error('Update Property Error:', updateError);
    return {
      success: false,
      message: updateError.message || 'Failed to update property listing in database.',
    };
  }

  revalidatePath('/properties');
  revalidatePath(`/properties/${slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/properties');
  revalidatePath(`/admin/properties/${propertyId}`);

  return { success: true, message: 'Property listing updated successfully.', property: updated };
}

/**
 * 3. Quick toggle for Publication Status (Draft / Published / Archived)
 */
export async function setPublicationStatus(
  propertyId: string,
  status: 'draft' | 'published' | 'archived'
) {
  const session = await verifyStaffSession();
  if (!session.authorized) {
    return { success: false, message: 'Unauthorized.' };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('properties')
    .update({ publication_status: status, updated_at: new Date().toISOString() })
    .eq('id', propertyId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/properties');
  revalidatePath('/admin');
  revalidatePath('/admin/properties');
  return { success: true, message: `Listing publication status changed to ${status}.` };
}

/**
 * 4. Quick toggle for Availability/Transaction Status (Available / Under Offer / Sold / Rented)
 */
export async function setAvailabilityStatus(
  propertyId: string,
  status: 'available' | 'under_offer' | 'sold' | 'rented'
) {
  const session = await verifyStaffSession();
  if (!session.authorized) {
    return { success: false, message: 'Unauthorized.' };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('properties')
    .update({ availability_status: status, updated_at: new Date().toISOString() })
    .eq('id', propertyId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/properties');
  revalidatePath('/admin');
  revalidatePath('/admin/properties');
  return { success: true, message: `Transaction status updated to ${status}.` };
}

/**
 * 5. Delete Property Listing (Admin Only)
 */
export async function deleteProperty(propertyId: string) {
  const session = await verifyStaffSession();
  if (!session.authorized) {
    return { success: false, message: 'Unauthorized.' };
  }

  if (session.role !== 'admin') {
    return { success: false, message: 'Forbidden: Only administrators can permanently delete listings.' };
  }

  const supabase = createClient();
  const { error } = await supabase.from('properties').delete().eq('id', propertyId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/properties');
  revalidatePath('/admin');
  revalidatePath('/admin/properties');

  return { success: true, message: 'Property listing deleted successfully.' };
}

/**
 * 6. Server-side Property Media Upload to Supabase Storage
 */
export async function uploadPropertyMedia(formData: FormData) {
  const session = await verifyStaffSession();
  if (!session.authorized) {
    return { success: false, message: 'Unauthorized: Please log in to upload media.' };
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { success: false, message: 'No file provided.' };
  }

  // Validate MIME Type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      message: 'Invalid file format. Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  // Validate File Size (Max 10MB)
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { success: false, message: 'File exceeds maximum upload size of 10MB.' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    // When Supabase is unconfigured in local mock mode, generate a local preview placeholder
    return {
      success: true,
      url: `/HomaceLogo.png`,
      message: 'Local mock mode: using default placeholder media.',
    };
  }

  try {
    const supabase = createClient();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueFileName = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `properties/${uniqueFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('property-media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError);
      return { success: false, message: uploadError.message || 'Storage upload failed.' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('property-media')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      message: 'Image uploaded successfully.',
    };
  } catch (err: any) {
    console.error('Upload Exception:', err);
    return { success: false, message: err?.message || 'Server upload exception occurred.' };
  }
}
