import { FaGithub } from "react-icons/fa";

export function GithubLink() {
  return (
    <a
      href="https://github.com/onegkg/Jastrow-Search"
      target="_blank"
      rel="noopener noreferrer"
      className="github-link"
      aria-label="View source on GitHub"
      style={{
        position: "fixed",
        bottom: "3rem",
        right: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "4rem",
        height: "4rem",
        backgroundColor: "white",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        color: "#333",
        fontSize: "3rem",
        transition: "all 0.3s ease",
        opacity: 0.9,
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.9";
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
      }}
    >
      <FaGithub />
    </a>
  );
}
