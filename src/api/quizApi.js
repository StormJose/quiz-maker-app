
const baseURL = "http://localhost:8000/quizzes";


export const fetchQuizzes = async function() {
  try {

    
    const res = await fetch(`${baseURL}`);
    const data = await res.json();
    
    if (!res.ok) throw new Error('Não foi possível carregar seus quizzes, amigo 🫤')

      
    return data;

    } catch(error) {
      console.log(error)
      return { error: error.message };
  
    }

}

export const fetchQuiz = async function(quizId) {
    try {

      const res = await fetch(`${baseURL}/?id=${quizId}`);
      const data = await res.json();
      console.log(data)
      if (data.length === 0) throw new Error('Houve um erro ao carregar este quiz 🫤')
        
      return data

      } catch(error) {
        
        console.error(error)
        return {error: error.message}
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

export const updateQuiz = async function(updatedQuiz) {
  try {
    const res = await fetch(`${baseURL}/${updatedQuiz.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify(updatedQuiz)
    
    })
    
    const data = res.json()
  
    return data

  } catch(error) {
    console.error(error)
    throw error
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





