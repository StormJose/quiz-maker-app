import toast from "react-hot-toast";


export const feedback = {
    
  success: (message: string = "Ação concluída com sucesso!", ...args: [string]) =>
    toast.success(message),
  error: (message: string = "Algo deu errado :/", ...args: []) =>
    toast.error(message),
  loading: (message: string = "Carregando", ...args: []) =>
    toast.loading(message),
};