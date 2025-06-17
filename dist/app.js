import express from 'express';
const app = express();
app.use(express.json());
app.use((req, res) => {
    res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log('Server running in http://localhost:3000/');
});
//# sourceMappingURL=app.js.map