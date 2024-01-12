import { Button, Modal } from "pol-ui";
import { useState } from "react";
const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <main>
      <h1>Games</h1>
      <h2>By Pol Gubau Amores</h2>

      <nav>
        <ul>
          <li>
            <a href="/memo">Memo</a>
          </li>
          <li>
            <a href="/words-minute">Words per minute</a>
          </li>
        </ul>
        <Button onClick={() => {}}>Start</Button>
      </nav>
      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.)
              goes into effect on May 25 and is meant to ensure a common set of
              data rights in the European Union. It requires organizations to
              notify users as soon as possible of high-risk data breaches that
              could personally affect them.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default HomePage;
