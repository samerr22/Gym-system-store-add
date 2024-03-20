import { useSelector } from "react-redux";
import "react-circular-progressbar/dist/styles.css";
import { signoutSuccess } from "../redux/user/userSilce";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      {currentUser.isStoreManger && (
        <>
          <div className="flex justify-center items-center gap-2">
            <Link to={"/create-post"}>
              <button
                className="  bg-blue-700 text-white p-3 rounded-lg w-[460px] h-11 hover:opacity-90"
                type="button"
                gradientDuoTone="purpleToPink"
              >
                Add new Items
              </button>
            </Link>
            <Link to={"/view"}>
              <button
                className="  bg-blue-700 text-white p-3 rounded-lg w-[460px] h-11 hover:opacity-90"
                type="button"
                gradientDuoTone="purpleToPink"
              >
                view
              </button>
            </Link>
          </div>
        </>
      )}

      <span onClick={handleSignout} className="cursor-pointer">
        Sign Out
      </span>
    </div>
  );
}
