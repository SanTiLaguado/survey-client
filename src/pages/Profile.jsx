import React, { useEffect} from "react";

const Surveys = () => {
    
    useEffect(() => {
        document.title = 'Mi Perfil - Campus Survey';
    }, []);

    return (
        <section className="main" id="profile">
            <h1>Profile</h1>
        </section>
    );
};

export default Surveys;