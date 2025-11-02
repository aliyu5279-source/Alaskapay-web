import XCTest

class AppUITests: XCTestCase {
    
    override func setUpWithError() throws {
        continueAfterFailure = false
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()
    }
    
    func testScreenshots() throws {
        let app = XCUIApplication()
        
        // Wait for app to load
        sleep(2)
        
        // Screenshot 1: Dashboard/Home
        snapshot("01Dashboard")
        sleep(1)
        
        // Screenshot 2: Wallet
        if app.buttons["Wallet"].exists {
            app.buttons["Wallet"].tap()
            sleep(1)
            snapshot("02Wallet")
            app.navigationBars.buttons.element(boundBy: 0).tap()
        }
        
        // Screenshot 3: Send Money
        if app.buttons["Send"].exists {
            app.buttons["Send"].tap()
            sleep(1)
            snapshot("03SendMoney")
            app.navigationBars.buttons.element(boundBy: 0).tap()
        }
        
        // Screenshot 4: Virtual Cards
        if app.buttons["Cards"].exists {
            app.buttons["Cards"].tap()
            sleep(1)
            snapshot("04VirtualCards")
            app.navigationBars.buttons.element(boundBy: 0).tap()
        }
        
        // Screenshot 5: Bill Payment
        if app.buttons["Bills"].exists {
            app.buttons["Bills"].tap()
            sleep(1)
            snapshot("05BillPayment")
        }
    }
}
