const github = username => {
  const query_options = username =>
    `-label:invalid+created:2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+type:pr+is:public+author:${username}`;
  const query = query_options(username);
  const issueSearchUrl = `https://api.github.com/search/issues?q=${query}`;

  return fetch(issueSearchUrl)
    .then(res => res.json())
    .then(res => res);
};

export default github;
