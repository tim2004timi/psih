import React, { useState } from 'react';

const SearchableContent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const content = 
        "Это пример текста на странице. Вы можете искать слова в этом тексте./n Попробуйте найти слово 'поиск' или любое другое слово."
    ;

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const getHighlightedText = (text) => {
        if (!searchTerm) return text;

        const parts = text.split(new RegExp((`(${searchTerm})`), 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
            ) : part
        );
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Введите текст для поиска"
            />
            <div style={{ marginTop: '20px' }}>
                {getHighlightedText(content)}
            </div>
        </div>
    );
};

export default SearchableContent;
