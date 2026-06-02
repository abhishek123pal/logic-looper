export function getGuestUser() {
  let user = localStorage.getItem("logic_user");

  if (!user) {
    const timestamp = Date.now();
    const guestId = `user_${timestamp}`;
    
    user = {
      id: guestId,
      // 👈 Backend 'email' mangta hai, toh hum ek placeholder de dete hain
      email: `guest_${timestamp}@logiclooper.com`, 
      guest: true,
      totalPoints: 0
    };
    
    localStorage.setItem("logic_user", JSON.stringify(user));
  } else {
    user = JSON.parse(user);
  }

  return user;
}