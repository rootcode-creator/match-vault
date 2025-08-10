import { auth, signOut } from "@/auth";
import { FaRegSmile } from "react-icons/fa";

export default async function Home() {
    const session = await auth();
  return (
    <div>
      <h1 className="text-3xl">Hello App!</h1>


<h3 className="text-2xl font-semibold">

  User session data:
</h3>
   {session ? (

    <div>
      <pre>

        {
          JSON.stringify(session, null, 2) 
        }
      </pre>
     <form
            action={async () => {
              "use server";
              await signOut();
            }}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        >
          <FaRegSmile size={18} />
          Sign out
        </button>
        
      </form>

</div>
   ):(
   
   <div>
     Not signed in
   </div>
   
  
 
  )}
 </div>
  );
 
}