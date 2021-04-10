import dotenv from 'dotenv';
dotenv.config();

const globalPath = process.env.PORTFOLIO_FILES_PATH

export const RWD = (req, res) => {
    const filePath = `${globalPath}Responsive Web Design Cert.png`;
    res.status(200).sendFile(filePath);
}

export const JS = (req, res) => {
    const filePath = `${globalPath}JavaScript Cert.png`;
    res.status(200).sendFile(filePath);
}

export const RESUME = (req, res) => {
    const filePath = `${globalPath}Preetam's Resume.pdf`;
    res.status(200).sendFile(filePath);
}