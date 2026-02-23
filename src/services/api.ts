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
    const response = await fetch('/api/employees', {
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

    // The API returns a specific format: {"TABLE_DATA": {"data": [["Name", "Role", "City", "Ext", "Date", "Salary"], ...]}}
    if (data && data.TABLE_DATA && Array.isArray(data.TABLE_DATA.data)) {
      result = data.TABLE_DATA.data.map((row: any[], index: number) => {
        // Clean up salary string (e.g. "$320,800" -> "320800")
        const rawSalary = row[5] || '0';
        const cleanSalary = rawSalary.replace(/[^0-9.-]+/g, "");

        return {
          id: String(index + 1),
          user_name: row[0] || 'Unknown',
          user_department: row[1] || 'Unknown',
          user_city: row[2] || 'Unknown',
          user_age: '30', // Default age as it's not in the API
          user_email: `${(row[0] || 'user').replace(/\s+/g, '.').toLowerCase()}@example.com`,
          user_gender: 'Not Specified',
          user_salary: cleanSalary,
          user_status: 'Active'
        } as Employee;
      });
    } else if (Array.isArray(data)) {
      result = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        result = data.data;
      } else {
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
