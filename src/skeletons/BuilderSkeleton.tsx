

const pseudoItems = [
    {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id:5} 
]

const pseudoAnswers = [
     {id: 1}, {id: 2}, {id: 3}, {id: 4}
]
export default function BuilderSkeleton() {

    return (<div className="px-4 h-full rounded-xl  flex flex-col gap-12 animate-pulse">
      <form>
         <div className="px-4 my-4 h-8 rounded-md bg-gray-100 animate-pulse">
       
        </div>
        <div className="p-4 my-4  rounded-xl bg-gray-100 animate-pulse">
          <ul className="flex items-center gap-4 ">
            {pseudoItems?.map((item) => (
                <li key={item?.id} className="w-24 h-8 px-4 bg-gray-200 rounded-md"></li>

            ))}
          </ul>
        </div>

        <div className="h-24 mb-12 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>

        <div className="mt-12 ">
            <ul className="bg-gray-200 rounded-xl p-4 flex flex-col max-w-[300px] gap-4  ">
                {pseudoAnswers.map((answer) => (
                    <li key={answer.id} className="h-8 bg-gray-300 rounded-xl"></li>
                ))}
            </ul>
        </div>
      </form>
    </div>)
}