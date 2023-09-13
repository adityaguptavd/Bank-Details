// This code will be injected when the user selects IFSC code in order to fetch data
const ifscForm = '<input type="text" placeholder="Enter IFSC Code here" required class="inputControl" name="IFSC_Code"><button type="submit" class="inputControl btn">Search</button>'

// The default code of respective dropdowns
const stateCascade = '<select name="state" id="state" class="inputControl" required><option value="" selected="selected">Select State</option></select>'
const districtCascade = '<select name="district" id="district" class="inputControl" required><option value="" selected="selected">Please Select State First</option></select>'
const cityCascade = '<select name="city" id="city" class="inputControl" required><option value="" selected="selected">Please Select District First</option></select>'
const centerCascade = '<select name="center" id="center" class="inputControl" required><option value="" selected="selected">Please Select City First</option></select>'
const branchCascade = '<select name="branch" id="branch" class="inputControl" required><option value="" selected="selected">Please Select Center First</option></select><button type="submit" class="inputControl btn">Search</button>'

// Adding event listener to the button for redirecting user to homepage
$(document).on('click', '#searchAgain', () => {
    window.location.href = '/';
})

const base_url = "https://bank-apis.justinclicks.com/API/V1/STATE";


// Function for data fetching through API based on states, districts, cities etc.
async function getListOF(url) {
    try {
        const result = await axios.get(base_url + url);
        // Checking whether the data is a json file or not. If so then remove '.json' for showing branch name on the dropdown.
        if(result.data[0].indexOf('.json' >= 0)){
            result.data = result.data.map(str => str.replace('.json', ''));
        }
        console.log(result.data);
        return result.data;
    }
    catch (error) {
        console.log(error)
        return 404;
    }
}

// Function to add cascades to the dropdown
function addCascades(additional_url, id)
{
    getListOF(additional_url).then(result => {
        if(result!=404){
            $('#'+id).html(`<select name="${id}" id="${id}" class="inputControl" required selected = "selected"><option value="" selected="selected">Select ${id[0].toUpperCase() + id.substring(1)}</option></select>`);
            for(let i = 0; i < result.length; i++)
            {
                $('#' + id).append(`<option value="${result[i]}">${result[i]}</option>`);
            }
        }
    });
}

// If the user changes any of the dropdown, this function will reset all the dropdowns below it.
function resetSelection(id, form){
    for(let i = 0; i < id.length; i++)
    {
        $(id[i]).html(form[i]);
    }
}

// Adding event listener for triggering whether the user selects ifsc method or location.
$(document).on('change', '#searchBy', async function(){
    if($(this).val() == 'ifsc')
    {
        $('#formType').html(ifscForm); // This will add the options required for ifsc method of searching
    }
    else if($(this).val() == 'location')
    {
        $('#formType').html(stateCascade + districtCascade + cityCascade + centerCascade + branchCascade); // This will add the options required for location method of searching
        $('#formType').css("min-width" , "300px");

        // As the location method is selected, the lists of all states are added to the dropdown
        addCascades('/', 'state');
        let state = '', district = '', city = '', center = '';

        // Adding event listener to all the dropdowns (except branch) in order to filter the corresponding cities, districts, centers and branches
        $(document).on('change', '#state', function(){
            state = $(this).val();
            resetSelection(['#district', '#city', '#center', '#branch'], [districtCascade, cityCascade, centerCascade, branchCascade]);
            addCascades(`/${state}/`, 'district');
        });
        $(document).on('change', '#district', function(){
            district = $(this).val();
            resetSelection(['#city', '#center', '#branch'], [cityCascade, centerCascade, branchCascade]);
            addCascades(`/${state}/${district}/`, 'city');
        });
        $(document).on('change', '#city', function(){
            city = $(this).val();
            resetSelection(['#center', '#branch'], [centerCascade, branchCascade]);
            addCascades(`/${state}/${district}/${city}/`, 'center');
        });
        $(document).on('change', '#center', function(){
            center = $(this).val();
            resetSelection(['#branch'], [branchCascade]);
            addCascades(`/${state}/${district}/${city}/${center}`, 'branch');
        });
    }
});