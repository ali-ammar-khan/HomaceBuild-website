'use server';

import { PropertyFormSchema, PropertyInput } from '@/lib/validations/property';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProperty(input: PropertyInput) {
  const supabase = createClient();

  // 1. Verify caller session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: 'Unauthorized: Please log in to manage listings.' };
  }

  // 2. Fetch user role from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const userRole = profile?.role || 'agent';

  // 3. Validate input with Zod
  const validation = PropertyFormSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed. Please verify the property specifications.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const data = validation.data;

  // 4. Enforce agent attribution guard
  let assignedAgentId = data.agent_id;
  if (userRole === 'agent') {
    assignedAgentId = user.id; // Agents cannot assign properties to other agents
  }

  // 5. Generate slug from title and reference code
  const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${data.reference_code.toLowerCase()}`;

  // 6. Insert property record
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
      created_by: user.id,
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
  revalidatePath('/admin/properties');

  return { success: true, message: 'Property listing created successfully.', property: created };
}

export async function deleteProperty(propertyId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized.' };
  }

  // Enforce admin check for deletion
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { success: false, message: 'Forbidden: Only administrators can delete listings.' };
  }

  const { error } = await supabase.from('properties').delete().eq('id', propertyId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/properties');
  revalidatePath('/admin/properties');

  return { success: true, message: 'Property removed successfully.' };
}
