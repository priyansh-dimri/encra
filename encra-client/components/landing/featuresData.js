import SecurityIcon from "@mui/icons-material/Security";
import SyncIcon from "@mui/icons-material/Sync";
import SpeedIcon from "@mui/icons-material/Speed";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";

const features = [
  {
    title: "Quantum-Safe Encryption",
    description:
      "Encra uses Kyber for post-quantum key exchange, paired with AES-256 to keep your messages secure—today and tomorrow.",
    icon: SecurityIcon,
  },
  {
    title: "True Privacy by Design",
    description:
      "No tracking. No cloud-stored keys. Just encrypted conversations only you and your recipient can read.",
    icon: PrivacyTipIcon,
  },
  {
    title: "Reliable Real-Time Messaging",
    description:
      "Built on Socket.IO, Encra delivers messages instantly with a smooth, responsive experience across devices.",
    icon: SyncIcon,
  },
  {
    title: "Performance-First Architecture",
    description:
      "Lean data flows and local-first design ensure quick load times and snappy interactions, even at scale.",
    icon: SpeedIcon,
  },
];

export default features;
