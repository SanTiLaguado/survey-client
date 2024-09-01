import React, { useEffect } from "react";

const UserHome = () => {

    useEffect(() => {
        document.title = 'Inicio - Campus Survey';
    }, []);

    return (
        <section className="main" id="userhome">
            <h1>Bienvenido a Campus Survey </h1>
        </section>
    );
};

export default UserHome;