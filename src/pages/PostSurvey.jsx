import React, { useEffect } from 'react';
import { Select, Space } from 'antd';

const PostSurvey = () => {

    useEffect(() => {
        document.title = 'Publicar Encuestas - Admin Campus Survey';
    }, []);

    return (
        <section className="main" id="responses">
            <h1>Publicar Encuestas</h1>
            <div className='main-card'>
                <h2>Encuestas disponibles</h2>
                <Select
                    defaultValue="lucy"
                    style={{ width: 120 }}
                    options={[
                        { value: 'jack', label: 'Jack' },
                        { value: 'lucy', label: 'Lucy' },
                        { value: 'Yiminghe', label: 'yiminghe' },
                        { value: 'disabled', label: 'Disabled', disabled: true },
                    ]}
                />
            </div>
        </section>
    );
};

export default PostSurvey;
