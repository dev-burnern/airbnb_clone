import { FaBars } from 'react-icons/fa';
import { FiGlobe } from "react-icons/fi";
import { MdOutlineManageAccounts } from "react-icons/md";


export default function Button() {
  return (
    <button style={{
      background: '#eee',
      border: 'none',
      borderRadius: '50%',
      width: 36,
      height: 36,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    }}>
      <FaBars size={18} color="#000" />
    </button>
  );
}
