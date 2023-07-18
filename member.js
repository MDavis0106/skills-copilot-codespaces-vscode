function skillsMember() {
    var member = document.getElementById("member");
    var memberValue = member.options[member.selectedIndex].value;
    var memberText = member.options[member.selectedIndex].text;
    var memberSkills = document.getElementById("memberSkills");
    if (memberValue == "yes") {
        memberSkills.style.display = "block";
    } else {
        memberSkills.style.display = "none";
    }
}