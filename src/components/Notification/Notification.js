import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

const Notification = ({ message, variant, onClose }) => {
    const [show, setShow] = useState(true);

    return (
        <CSSTransition
            in={show}
            timeout={300}
            classNames="fade"
            unmountOnExit
            onExited={onClose}
        >
            <Alert
                className={`fade ${show ? 'fade-in' : 'fade-out'}`}
                show={show}
                variant={variant}
                onClose={() => {
                    setShow(false);
                    onClose();
                }}
                style={{ position: 'fixed', width: '100%', zIndex: 1000 }}
            >
                {message}
            </Alert>
        </CSSTransition>

    );
};

export default Notification;