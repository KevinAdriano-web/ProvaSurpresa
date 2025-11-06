CREATE TABLE login (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE prova (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    FOREIGN KEY (login) REFERENCES login(id)
);

CREATE TABLE pergunta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prova INT NOT NULL,
    ordem INT NOT NULL,
    pergunta TEXT NOT NULL,
    imagem VARCHAR(255),
    FOREIGN KEY (prova) REFERENCES prova(id)
);

CREATE TABLE alternativa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pergunta INT NOT NULL,
    descricao TEXT NOT NULL,
    correta BOOLEAN NOT NULL,
    FOREIGN KEY (pergunta) REFERENCES pergunta(id)
);

CREATE TABLE prova_resposta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login INT NOT NULL,
    prova INT NOT NULL,
    criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (login) REFERENCES login(id),
    FOREIGN KEY (prova) REFERENCES prova(id)
);

CREATE TABLE prova_resposta_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prova_resposta INT NOT NULL,
    pergunta INT NOT NULL,
    alternativa INT NOT NULL,
    FOREIGN KEY (prova_resposta) REFERENCES prova_resposta(id),
    FOREIGN KEY (pergunta) REFERENCES pergunta(id),
    FOREIGN KEY (alternativa) REFERENCES alternativa(id)
);