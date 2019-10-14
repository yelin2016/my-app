class Person {
  constructor() {
    this.name = 'ye1';
    this.age = 20;
  }
  getName() {
    console.log(this.name);
  }
  getAge() {
    console.log(this.age);
  }
}
function CreateInstance() {
  var person = null;
  function getPerson() {
    if(!person) {
      person = new Person();
      return person
    }
    return person;
  }
  return getPerson;
}

var createPerson = CreateInstance();
var person1 = createPerson();
var person2 = createPerson();
console.log(person1 === person2);
console.log(person1);
