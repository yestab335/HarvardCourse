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

// Submit Email Function
function submit_email(event) {
  event.preventDefault();

  const composeRecipients = document.querySelector('#compose-recipients');
  const composeSubject = document.querySelector('#compose-subject');
  const composeBody = document.querySelector('#compose-body');

  // Post Email To API Route
  fetch ('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: composeRecipients.value,
      subject: composeSubject.value,
      body: composeBody.value
    })
  })
  .then(() => load_mailbox('sent'));
}

// Load Email Function
function load_email(id) {
  fetch('/emails/' + id)
  .then(response => response.json())
  .then(email => {
    // Show Email And Hide Other Views
    hideViews('#emails-view', '#compose-view');
    showView('#email-view');

    // Display Email
    const emailView = document.querySelector('#email-view');
    emailView.innerHTML = `
      <ul class="list-group">
        <li class="list-group-items"><b>From:</b> <span>${email.sender}</span></li>
        <li class="list-group-items"><b>To:</b> <span>${email.recipients}</span></li>
        <li class="list-group-items"><b>Subject:</b> <span>${email.subject}</span></li>
        <li class="list-group-items"><b>Time:</b> <span>${email.timestamp}</span></li>
      </ul>
      <p class="m-2">${email.body}</p>
    `;

    // Create Reply Button And Append To Email View
    const reply = createButton('Reply', 'btn-primary m-1');
    reply.addEventListener('click', () => {
      compose_email();

      // Populate Fields With Information From Email
      document.querySelector('#compose-recipients').value = email.sender;
      const subject = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`;
      document.querySelector('#compose-subject').value = subject;
      const body = `On ${email.timestamp}, ${email.sender} wrote: ${email.body}`;
      document.querySelector('#compose-body').value = body;
    });

    emailView.appendChild(reply);

    // Create Archive Button And Append To Email View
    const archiveButton = createButton(email.archived ? 'Unarchive' : 'Archive', 'btn-primary m-1');
    archiveButton.addEventListener('click', () => {
      fetch('/emails/' + email.id, {
        method: 'PUT',
        body: JSON.stringify({
          archived: !email.archived
        })
      })
      .then(() => load_mailbox('inbox'));
    });

    emailView.appendChild(archiveButton);

    // Create Mark As Unread Button And Append To Email View
    const readButton = createButton('Mark as Unread', 'btn-secondary m-1')
    readButton.addEventListener('click', () => {
      fetch('/emails/' + email.id, {
        method: 'PUT',
        body: JSON.stringify({
          read: false
        })
        .then(() => load_mailbox('inbox'))
      })

      emailView.appendChild(readButton);

      // Mark This Email As Read
      if (email.read) {
        fetch('/emails/' + email.id, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })
      }
    })
  });
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