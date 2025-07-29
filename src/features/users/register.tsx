import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Form } from "react-router";
import Button from "@/ui/Button";



export default function Register() {


    const { status, error, signUp, dispatch } = useAuth()

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

   
    async function handleSubmit () {

        const formErrors = {}

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex =
        /^(?=.*?[A-Z)(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        
    
        const validEmail = emailRegex.test(form.email)
        const validPassword = passwordRegex.test(form.password)


        if (!form.email) formErrors.email = 'E-mail não pode estar vazio'
            
        if (!form.password) formErrors.password = 'Senha não pode estar vazio'

        if (!validEmail) formErrors.email = 'Formato de email incorreto'

        if (!validPassword) formErrors.password = 'Senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractére especial'
  

        setErrors(formErrors)

        if (Object.entries(formErrors).length === 0) {
            try {

              await signUp(form.email, form.password)

  
            } catch(error) {
                console.error(error)

            }  

        }

    }

  return (
    <Form className="md:max-w-[440px] max-w-[1440px] h-screen my-0 mx-auto px-8 py-[120px] flex flex-col justify-center gap-4 ">
      <div className="flex flex-col gap-2">

        <Input
          className={`${errors.email && "border-red-600"}`}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Input
          className={`${errors.password && "border-red-600"}`}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {errors.password && (
          <span className="text-red-500 ml-2 overflow-x-scroll whitespace-nowrap scroll-m-2.5">
            {errors.password}
          </span>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        styles={"standard"}
        additionalStyles={"justify-center"}>
        Iniciar
      </Button>
    </Form>
  );
}