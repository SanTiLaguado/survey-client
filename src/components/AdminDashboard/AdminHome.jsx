import React, { useEffect } from "react";

const AdminHome = () => {

    useEffect(() => {
        document.title = 'Inicio - Admin Campus Survey';
    }, []);

    return (
        <section className="main" id="adminhome">
            <h1>Bienvenido</h1>
            <h2>Panel Administrador Campus Survey</h2>
        </section>
    );
};

export default AdminHome;