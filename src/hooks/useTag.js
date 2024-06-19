export const useTag = () => {

  const addTag = async (tag) => {
    try {
        console.log('tag to create',tag);
      const response = await fetch("https://localhost:7237/api/Tag/Create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tag),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newTag = await response.json();
      return newTag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  };

  return { addTag };
};

export default useTag;
