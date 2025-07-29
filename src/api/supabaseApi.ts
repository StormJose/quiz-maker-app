import supabase from "@/utils/supabase";

const baseURL = "http://localhost:8000/quizzes";


export const fetchQuizzes = async function(userId) {
   try {
     const { data, error } = await supabase
       .from("full_quiz_view")
       .select("*")
       .eq("user", userId)


     if (error) {
       console.log(error);
       throw error;
     }
console.log(data);
     return {
      data, 
      error
     }

   } catch (error) {
     console.error(error);
   }
 
}


export const fetchQuiz = async function(quizId) {
       try {
         const { data, error } = await supabase
           .from("full_quiz_view")
           .select("*")
           .eq("id", quizId).single()

         if (error) {
           console.log(error);
           throw error;
         }

         
         return {
           data,
           error,
         };
       } catch (error) {
         console.error(error);
       }
}

export const addQuiz = async function (newQuiz) {
  try {
    const res = await fetch(`${baseURL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuiz),
    });

    // if (!res.ok) throw new Error("Erro ao enviar quiz :/");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

export const updateQuiz = async function(quizData) {
  try {
    const { data, error } = await supabase
      .from("full_quiz_view").update(quizData)
      .eq("id", quizData.id).select('*')
      

    if (error) {
      console.log(error);
      throw error;
    }

    return {
      data,
      error,
    };
  } catch (error) {
    console.error(error);
  }
}

export const deleteQuiz = async function(quizId) {
    try {

        const res = await fetch(`${baseURL}/${quizId}`, {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            
        })

        if (!res.ok) throw new Error('Erro ao deletar quiz')

    } catch(error) {
        console.error(error)
        throw error
    }
}


// const addQuestion = async function(quizId, questionId) {
//     const res = await fetch(`http://localhost:8000/questions`);
// }

const updateQuestion = async function(questionId) {}

const deleteQuestion = async function(questionId) {}





