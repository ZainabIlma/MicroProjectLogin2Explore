const JPDB_API_BASE_URL = "https://api.login2explore.com:5577";
const DB_NAME = "PROJECTDB";
const REL_NAME = "PROJECT-TABLE";
const TOKEN = "90934642|-31949206927999700|90956475";

$(document).ready(function () {
    resetForm();

    $("#projectId").on("change", function () {
        const projectId = $("#projectId").val().trim();
        if (projectId === "") return;

        let getByKeyReq = {
            token: TOKEN,
            cmd: "GET_BY_KEY",
            dbName: DB_NAME,
            rel: REL_NAME,
            jsonStr: JSON.stringify({ "Project-ID": projectId })
        };

        $.post(`${JPDB_API_BASE_URL}/api/irl`, JSON.stringify(getByKeyReq), function (response) {
            if (response.status === 400) {
                enableFields();
                $("#saveBtn").prop("disabled", false);
                $("#resetBtn").prop("disabled", false);
                $("#projectName").focus();
            } else if (response.status === 200) {
                const data = JSON.parse(response.data).record;
                $("#projectName").val(data["Project-Name"]);
                $("#assignedTo").val(data["Assigned-To"]);
                $("#assignmentDate").val(data["Assignment-Date"]);
                $("#deadline").val(data["Deadline"]);

                enableFields();
                $("#projectId").prop("disabled", true);
                $("#updateBtn").prop("disabled", false);
                $("#resetBtn").prop("disabled", false);
                $("#projectName").focus();
            }
        }, "json").fail(() => alert("Error retrieving data from database"));
    });

    $("#saveBtn").click(function () {
        if (!validateFields()) return;

        const projectData = {
            "Project-ID": $("#projectId").val().trim(),
            "Project-Name": $("#projectName").val().trim(),
            "Assigned-To": $("#assignedTo").val().trim(),
            "Assignment-Date": $("#assignmentDate").val(),
            "Deadline": $("#deadline").val()
        };

        const putReq = {
            token: TOKEN,
            cmd: "PUT",
            dbName: DB_NAME,
            rel: REL_NAME,
            jsonStr: JSON.stringify(projectData)
        };

        $.post(`${JPDB_API_BASE_URL}/api/iml`, JSON.stringify(putReq), function () {
            alert("Record saved successfully!");
            resetForm();
        }, "json");
    });

    $("#updateBtn").click(function () {
        if (!validateFields()) return;

        const projectData = {
            "Project-ID": $("#projectId").val().trim(),
            "Project-Name": $("#projectName").val().trim(),
            "Assigned-To": $("#assignedTo").val().trim(),
            "Assignment-Date": $("#assignmentDate").val(),
            "Deadline": $("#deadline").val()
        };

        const updateReq = {
            token: TOKEN,
            cmd: "UPDATE",
            dbName: DB_NAME,
            rel: REL_NAME,
            jsonStr: JSON.stringify(projectData)
        };

        $.post(`${JPDB_API_BASE_URL}/api/iml`, JSON.stringify(updateReq), function () {
            alert("Record updated successfully!");
            resetForm();
        }, "json");
    });

    $("#resetBtn").click(function () {
        resetForm();
    });
});

function resetForm() {
    $("#projectForm")[0].reset();
    $("#projectId").prop("disabled", false).focus();
    $("#projectName, #assignedTo, #assignmentDate, #deadline").prop("disabled", true).val("");
    $("#saveBtn, #updateBtn, #resetBtn").prop("disabled", true);
}

function enableFields() {
    $("#projectName, #assignedTo, #assignmentDate, #deadline").prop("disabled", false);
}

function validateFields() {
    if ($("#projectId").val().trim() === "" ||
        $("#projectName").val().trim() === "" ||
        $("#assignedTo").val().trim() === "" ||
        $("#assignmentDate").val() === "" ||
        $("#deadline").val() === "") {
        alert("Please fill in all fields.");
        return false;
    }
    return true;
}