import React, { useEffect } from 'react';

const PostSurvey = () => {

    useEffect(() => {
        document.title = 'Publicar Encuestas - Admin Campus Survey';
    }, []);

    return (
        <section className="main" id="responses">
            <h1>Publicar Encuestas</h1>
        </section>
    );
};

export default PostSurvey;
