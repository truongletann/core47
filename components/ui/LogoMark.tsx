"use client";

export function LogoMark() {
  return (
    <div className="group flex cursor-pointer items-center font-serif text-2xl font-black italic">
      <span
        className="text-neutral-700 transition-colors duration-300 group-hover:text-pink-100"
        style={{ textShadow: "0 0 5px transparent" }}
        onMouseOver={(e) => {
          e.currentTarget.style.textShadow =
            "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.textShadow = "none";
        }}
      >
        CORE
      </span>
      <span
        className="ml-1 text-neutral-800 transition-colors duration-300 group-hover:text-cyan-100"
        style={{ textShadow: "0 0 5px transparent" }}
        onMouseOver={(e) => {
          e.currentTarget.style.textShadow =
            "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.textShadow = "none";
        }}
      >
        47
      </span>
    </div>
  );
}