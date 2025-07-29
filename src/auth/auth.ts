import { createUser } from "@/api/supabaseApi";
import supabase from "@/utils/supabase";



export async function getCurrentUser() {

    try {
        const { data, error } = await supabase.auth.getUser()

        if (error) throw Error(error.message)

        return data

    } catch(error) {
     
      console.error(error)
      throw error

    }

}


export async function getUserData(id) {
    try {

        const { data, error } = await supabase
             .from("users")
             .select("*")
             .eq("id", id).single()
        

           if (error) {
             throw Error(error.message)
           }
        return data;
      
    } catch(error) { 
        console.error(error)
        throw error
    
    }
    
}

export async function signUpNewUser(email, password) {

    try {

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "https://localhost:5173",
            },
        });

        if (error) throw Error(error.message)
        return {
            data,
            error
        }
        
    } catch(error) {
        console.log(error)
        throw error
    }


 }


export async function signInWithEmail(email, password) {
    try {

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw Error(error.message)

        console.log(data)

        return {
            data,
            error
        }
    } catch(error) {
        console.error(error)
    }
}



export async function signOutUser () {
    return
}