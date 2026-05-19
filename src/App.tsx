import { createBrowserRouter,  RouterProvider } from "react-router"
import Home from "./Home"
import AppLayout, { protectedLoader } from "./ui/AppLayout";
import AllQuizzes, {
  loader as allQuizzesLoader,
} from "./features/quizzes/AllQuizzes";
import Quiz, { loader as quizLoader } from "./features/quizzes/Quiz";
import QuizResults from "./features/quizzes/QuizResults";
import InQuiz, {
  loader as questionsLoader,
} from "./features/quiz-taking/InQuiz";
import Register from "./features/users/Register";
import Login from "./features/users/login";
import NewBuilder from "./features/builder/new-builder";
import BuilderLayout, {
  editQuizLoader,
  newQuizLoader,
} from "./layouts/builder-layout";
import QuizSettings from "./features/settings/quiz-settings";
import ErrorBoundary from "./ui/error-boundary";
import Preview from "./features/builder/Preview";
import NotFound from "./ui/NotFound";
import Settings from "./features/users/settings";

const routes = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/quizzes",
    name: "Quizzes",
    element: <AllQuizzes />,
    loader: allQuizzesLoader,
    ErrorElement: <ErrorBoundary />,
  },
  {
    path: "/quizzes/:quizId",
    name: "Quiz",
    element: <Quiz />,
    ErrorElement: <ErrorBoundary />,
    loader: quizLoader,
  },

  {
    path: "/quiz/new",
    name: "New Quiz",
    id: "new-quiz",
    element: <BuilderLayout />,
    loader: newQuizLoader,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        name: "New Quiz - Builder",
        element: <NewBuilder />,
        ErrorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        name: "New Quiz - Settings",
        element: <QuizSettings />,
        ErrorElement: <ErrorBoundary />,
      },
      {
        path: "preview",
        name: "New Quiz - Builder",
        element: <Preview />,
        ErrorElement: <ErrorBoundary />,
      },
    ],
  },
  {
    path: "/quiz/:quizId/edit",
    name: "Edit Quiz",
    id: "edit-quiz",
    element: <BuilderLayout />,
    loader: editQuizLoader,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        name: "Edit Quiz - Builder",
        element: <NewBuilder />,
        ErrorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        name: "Edit Quiz - Settings",
        element: <QuizSettings />,
        ErrorElement: <ErrorBoundary />,
      },
      {
        path: "preview",
        name: "Edit Quiz - Builder",
        element: <Preview />,
        ErrorElement: <ErrorBoundary />,
      },
    ],
  },

  {
    path: "/quiz/results",
    name: "Quiz Results",
    element: <QuizResults />,
  },
   {
    path: "/settings",
    element: <Settings />,
  },
  // Add to your router configuration
{
  path: "/profile/:userId",
  // element: <ProfilePage />,
},
{
  path: "/profile/settings",
  // element: <ProfileSettings />,
}
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: protectedLoader,
    children: routes.map((route) => ({
      path: route.path === "/" ? undefined : route.path,
      element: route.element,
      index: route.path === "/",
      // errorElement: route.errorElement,
      action: route?.action,
      loader: route.loader,
      children: route.children?.map((route) => ({
        path: route.path === "/" ? undefined : route.path,
        element: route.element,
        index: route.path === "/",
      })),
    })),
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/signin",
    element: <Login />,
  },
 
  {
    path: "/quizzes/:quizId/questions/:questionId",
    element: <InQuiz />,
    errorElement: <ErrorBoundary />,
    loader: questionsLoader,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {

  return <RouterProvider router={router}/>
  
}

export default App
