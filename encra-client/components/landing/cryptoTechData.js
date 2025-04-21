import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloudOffIcon from "@mui/icons-material/CloudOff";

const cryptoTech = [
  {
    title: "Kyber Key Exchange",
    description:
      "Encra uses Kyber — a post-quantum key exchange algorithm — to securely share encryption keys between users.",
    icon: VpnKeyIcon,
  },
  {
    title: "AES-256 Encryption",
    description:
      "All messages are encrypted using AES-256 in the browser, ensuring strong, client-side confidentiality.",
    icon: LockIcon,
  },
  {
    title: "Local-Only Key Storage",
    description:
      "Encryption keys never leave your device. They're stored in localStorage and can be backed up manually.",
    icon: CloudOffIcon,
  },
];

export default cryptoTech;
