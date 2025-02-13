import { LogoIcon } from "../styles/icons/LogoIcon";

function NavBar() {
  return (
    <div>
      <div className="flex justify-between p-5 text-white">
        <div className="flex pl-5">
          <div>
            <LogoIcon />
          </div>
          <div className="pl-2">ChatZone</div>
        </div>
      </div>
      <hr className="border-t-2 border-dashed border-gray-500" />
    </div>
  );
}

export default NavBar;
