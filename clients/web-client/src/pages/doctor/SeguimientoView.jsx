import Navbar from "../../components/Navbar.jsx";
import FollowupsBoard from "../../components/followups/FollowupsBoard.jsx";

export default function SeguimientoView() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <FollowupsBoard mode="doctor" />
      </div>
    </>
  );
}
