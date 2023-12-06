import ScreenShot from "@/components/Screenshot";
import Image from "next/image";

export default function Home() {
  return (
    <div className="root">
      <header className="header">
        <Image src={"/logo.png"} width={200} height={50} />
      </header>
      <section>
        <ScreenShot />
      </section>
      <footer>
        <h3>Made by Haider Mansoor</h3>
        <h4>© 2023 Haider Mansoor All rights reserved</h4>
      </footer>
    </div>
  );
}
