export interface Employee {
  id: string;
  user_name: string;
  user_email: string;
  user_age: string;
  user_gender: string;
  user_salary: string;
  user_city: string;
  user_department: string;
  user_status: string;
}

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: '123456',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    
    let result: any = [];

    // The API might return an object with a data property or an array directly
    // Let's handle both cases to prevent the .filter is not a function error
    if (Array.isArray(data)) {
      result = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        result = data.data;
      } else {
        // If it's an object but not an array, try to extract values
        const values = Object.values(data);
        if (values.length > 0 && Array.isArray(values[0])) {
          result = values[0];
        } else {
          result = values;
        }
      }
    }

    // Ensure we always return an array
    return Array.isArray(result) ? result as Employee[] : [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};
