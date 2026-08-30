import toast from "react-hot-toast";


export const feedback = {
    
  // toast.function also accept a second "args" argument.
  success: (message: string = "Ação concluída com sucesso!") =>
    toast.success(message),
  error: (message: string = "Algo deu errado :/") =>
    toast.error(message),
  loading: (message: string = "Carregando") =>
    toast.loading(message),
};