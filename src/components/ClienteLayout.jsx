import BottomMenu from "./BottomMenu";

function ClienteLayout({ children }) {
  return (
    <div
      className="
        min-h-screen
        bg-[#3b2416]
        relative
      "
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(255,255,255,0.025) 1px,
            transparent 1px
          ),
          linear-gradient(
            0deg,
            rgba(0,0,0,0.05) 1px,
            transparent 1px
          )
        `,
        backgroundSize: "45px 45px",
      }}
    >
      <div
        className="
          min-h-screen
          bg-gradient-to-b
          from-[#4b2d1c]/80
          via-[#6b3e26]/40
          to-[#3b2416]/80
        "
      >
        <main
          className="
            min-h-screen
            max-w-7xl
            mx-auto
            bg-[#f7f2ec]
            pb-24
            shadow-2xl
          "
        >
          {children}
        </main>

        <BottomMenu />
      </div>
    </div>
  );
}

export default ClienteLayout;