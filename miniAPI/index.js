import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const SECRET_KEY = 'your-secret-key'; // zmień na coś bardziej bezpiecznego

app.use(cors());
app.use(express.json());

const users = [
  { id: '1', login: 'admin', password: 'admin123', firstName: 'Krystian', lastName: 'Zak', role: 'admin' }
];

// Endpoint logowania
app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Tworzymy JWT i refresh token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' } // Token ważny przez 1 godzinę
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    SECRET_KEY,
    { expiresIn: '7d' } // Refresh token ważny przez 7 dni
  );

  res.json({
    token,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
  });
});

// Endpoint do odświeżania tokenu
app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  jwt.verify(refreshToken, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token: newToken });
  });
});

// Endpoint do pobrania danych użytkownika
app.get('/api/user', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  });
});

app.listen(3000, () => {
  console.log('API działa na http://localhost:3000');
});
