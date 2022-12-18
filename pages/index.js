import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState();
  const [error, setError] = useState("");
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validation = async () => {
    const query = email;
    if (query != "") {
      try {
        await fetch("https://doofinanceserver.vercel.app/user/" + query)
          .then(async (res) => {
            let response = await res.json();
            return response;
          })
          .then((data) => {
            if (
              data[0] != null &&
              data[0].email == email &&
              data[0].password == pass
            ) {
              localStorage.setItem("id", data[0]._id);
              router.push({
                pathname: "/dashboard",
                query: { user: data[0]._id },
              });
            } else {
              setError("Нууц үг эсвэл Email буруу байна");
              setModalOpen(!modalOpen);
            }
          });
      } catch {
        setError("Холболтод алдаа гарлаа");
        setModalOpen(!modalOpen);
      }
    } else {
      setError("Email ээ оруулна уу");
      setModalOpen(!modalOpen);
    }
  };

  // const validation = async()=>{
  //   let  email1 = email
  //   await fetch("http://localhost:3001/user/"+email1).then((response) => {
  //     console.log(response);
  //   });

  // }

  return (
    <div className={styles.main}>
      <header className={styles.title}>Welcome to DooFinance</header>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <h1 className={styles.description}>Login</h1>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <span className={styles.span}>E-mail </span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <span className={styles.span}>Нууц үг </span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div>
            {errorMessage === "" ? null : (
              <div
                style={{
                  fontWeight: "500",
                  color: "red",
                }}
              >
                {errorMessage}
              </div>
            )}
          </div>
          <div>
            <button className={styles.button} onClick={() => validation()}>
              Нэвтрэх
            </button>
            <Link href="/register" className={styles.btn}>
              Бүртгүүлэх
            </Link>
          </div>
        </div>
      </div>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className=" modal-header">
          <h5 className=" modal-title" id="exampleModalLabel">
            Анхааруулга
          </h5>
        </div>
        <ModalBody>
          <div aria-hidden={true}>{error}</div>
          <div aria-hidden={true}>{errorMessage}</div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Хаах
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
