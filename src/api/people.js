const URL = "https://swapi.dev/api/";

export async function getPeople() {
  const response = await fetch(`${URL}people`);
  const people = await response.json();
  return people;
}

export async function getPeopleDetails(id = 1) {
  const response = await fetch(`${URL}people/${id}`);
  const details = await response.json();
  return details;
}

export async function searchCharacter(name) {
  const response = await fetch(`${URL}people?search=${name}`);
  const details = await response.json();
  return details;
}

export async function getPeopleByPage(page) {
  const response = await fetch(`${URL}people/?page=${page}`);
  const details = await response.json();
  return details;
}
