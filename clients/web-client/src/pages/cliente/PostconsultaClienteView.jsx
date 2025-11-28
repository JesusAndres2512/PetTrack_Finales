import Sidebar from "../../components/Sidebar.jsx";
import FollowupsBoard from "../../components/followups/FollowupsBoard.jsx";

const PostconsultaClienteView = () => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 p-6">
      <FollowupsBoard mode="client" />
    </div>
  </div>
);

export default PostconsultaClienteView;

