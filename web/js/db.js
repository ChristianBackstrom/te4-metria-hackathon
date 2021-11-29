const API_ADDRESS = 'localhost:3306';

export default {
  async getUser(userId) {
    const response = await fetch(`http://${API_ADDRESS}/user/${userId}`);
    const user = await response.json();
    return user;
  },
  async updateUser(userId, data) {
    const response = await fetch(`http://${API_ADDRESS}/user/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  },
  async getPlots() {
    const response = await fetch(`http://${API_ADDRESS}/plots`);
    const plots = await response.json();
    return plots;
  },
  async postPlot(plot) {
    const response = await fetch(`http://${API_ADDRESS}/plots`, {
      method: 'POST',
      body: JSON.stringify(plot),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    return result;
  },
};
