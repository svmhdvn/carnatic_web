var CurrentUser = {
  auth_token: m.prop(localStorage.getItem('carnatic-user-token') || '')
};