import express from 'express';
import groupRoutes from './api/groups';

const app = express();

app.get('/', (req, res) => {
    res.send('API running');
});

app.use('/api/groups', groupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
