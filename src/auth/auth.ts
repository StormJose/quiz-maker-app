import supabase from "@/utils/supabase";



export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserData(id: string) {
  try {
    if (!id) return 
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function signUpNewUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://localhost:5173",
      },
    });

    if (error) throw Error(error.message);
    return {
      data,
      error,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data, error };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error(error);
    throw error;
  }
}