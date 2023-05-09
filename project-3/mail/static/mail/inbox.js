document.addEventListener('DOMContentLoaded', function() {
  // Use Buttons To Toggle Between Views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By Default, Load The Inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show Compose View And Hide Other Views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear Out Composition Fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show The Mailbox And Hide Other Views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show The Mailbox Name
  document.querySelector('#emails-view').innerHTML = `
    <h3>
      ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}
    </h3>
  `;
}