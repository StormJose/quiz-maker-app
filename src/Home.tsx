import React from 'react'
import { Link } from 'react-router'
import BackLink from './ui/BackLink'
import Button from './ui/Button'

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex  items-center gap-2">
        <Link to="/quizzes">
          <Button styles="alternate">Encontrar um quiz</Button>
        </Link>
        <Link to="/quiz/new">
          <Button styles="standard">Criar Quiz</Button>
        </Link>
      </div>
    </div>
  );
}
