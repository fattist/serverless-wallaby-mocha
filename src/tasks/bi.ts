export const beacon = async (event: unknown, _context: unknown, callback: (e: unknown, s: unknown) => void): Promise<void> => {
    console.log('beacon', event);
    callback(null, true);
};